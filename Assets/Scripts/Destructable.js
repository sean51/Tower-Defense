#pragma strict

public class Destructable extends MonoBehaviour
{
	protected var health : int;
	protected var max_health : int;
	
	function Get_Health() : int
	{
		return health;
	}

	function Get_Max_Health() : int
	{
		return max_health;
	}
	
	function Hurt() : boolean
	{
		return health < max_health;
	}
}