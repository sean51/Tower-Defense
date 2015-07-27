#pragma strict

public class Mender_NPC extends NPC
{
	function Start () 
	{
		super.Start();
		GetComponent.<Animation>().Play("Spawn");
	}
	
	//To switch states this function must be gone through
	function Change_State(new_state : NPC_state)
	{
		switch (new_state)
		{
			case NPC_state.idle:
				my_state = NPC_state.idle;
				break;
			case NPC_state.moving:
				my_state = NPC_state.moving;
				break;
			case NPC_state.attacking:
				my_state = NPC_state.attacking;
				break;
		}
	}
	
	function Idle_State()
	{
		if (my_state == NPC_state.idle && search_timer > search_cooldown)
		{
			search_timer = 0.0f;
			var newTarget : GameObject = homeTower.GetComponent(Repair).Find_Mender_Target();
			if(newTarget != null)
			{
				target = newTarget;
				Change_State(NPC_state.moving);
			}
		}
	}
	
	function Attack_State()
	{
		
		if (target == null)
		{
			Change_State(NPC_state.idle);
		}
		else if (Vector3.Distance(transform.position, target.transform.position) < 1)
		{
			if(attack_timer >= attack_cooldown)
			{
				attack_timer = 0.0f;
				GetComponent.<Animation>().Stop();
				gameObject.transform.LookAt(Vector3(target.transform.position.x, gameObject.transform.position.y, target.transform.position.z));
				GetComponent.<Animation>().Play("BigAttack");
				mendTarget();
			}
		}
		else
		{
			Change_State(NPC_state.moving);
		}
	}
	
	function mendTarget()
	{
		if(target.gameObject.tag == "NPC")
		{
			if(!target.GetComponent(NPC).mend(20))
			{
				Change_State(NPC_state.idle);
			}
		}
		else if(target.gameObject.tag == "Tower")
		{
			if(!target.GetComponent(Tower).mend(20))
			{
				Change_State(NPC_state.idle);
			}
		}
		else
		{
			Debug.Log("HERE");
			//UnityEngineInternal.APIUpdaterRuntimeServices.AddComponent(target.gameObject, "Assets/NPC.js(193,17)", "conversionScript");
		}
	}
}